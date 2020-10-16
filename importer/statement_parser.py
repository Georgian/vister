import xlrd
from datetime import datetime
import util
from model import Transaction, Categories

XLS_FILE_TYPES = ["vnd.openxmlformats-officedocument.spreadsheetml.sheet", "vnd.ms-excel"]
CSV_FILE_TYPES = ["csv"]


class StatementParser(object):

    def __init__(self, headers, body):
        self.headers = headers
        self.body = body

    def parse(self):
        file_type = self.headers['ContentType']
        if file_type in XLS_FILE_TYPES:
            return self.parse_xls()
        elif file_type in CSV_FILE_TYPES:
            return self.parse_csv()

    def parse_xls(self):
        wb = xlrd.open_workbook(file_contents=self.body)
        # TODO Determine which bank are we reading
        return self.parse_xls_raiffeisen(wb)

    def parse_xls_raiffeisen(self, wb):
        sheet = wb.sheet_by_index(0)
        transactions = []

        for row_nbr in range(sheet.nrows):
            values = sheet.row_values(row_nbr)

            # If this row parses a date, we've reached the transactions
            try:
                self.format_date_raiffeisen(values[0])
            except ValueError:
                continue

            # Include beneficiary or issuer if available
            reference = values[11].split('|')[0]
            name_of_other_entity = values[8]
            if name_of_other_entity:
                reference += ' | ' + name_of_other_entity

            # Create transaction
            transaction = Transaction()
            transaction.completed_date = self.format_date_raiffeisen(values[1])
            transaction.reference = util.clear_spaces(reference)
            transaction.debit = values[2]
            transaction.credit = values[3]
            transaction.currency = 'RON' # TODO
            transaction.source = 'Raiffeisen'
            transaction.category = self.guess_category(reference)

            transactions.append(transaction)

        wb.release_resources()
        return transactions

    def format_date_raiffeisen(self, date_str):
        date = datetime.strptime(date_str, '%d/%m/%Y').date()
        return self.format_date(date)

    @staticmethod
    def format_date(date_obj):
        return date_obj.strftime('%-d %b %Y')

    # TODO Implement Naive Bayes
    @staticmethod
    def guess_category(ref):
        if ref.startswith('ATM') or ref.startswith('Revolut*3622*'):
            return Categories.SELF_TRANSFER
        elif ref.startswith('3PILLAR'):
            return Categories.SALARY
        elif ref.startswith('Pago'):
            return Categories.HOUSE
        elif ref.startswith('ITUNES') or ref.startswith('HBOEUROPESRO'):
            return Categories.SUBSCRIPTIONS
        elif ref.startswith('OMW'):
            return Categories.CAR
        elif ref.startswith('MAGAZIN BICICLETE DEP CLUJ-NAPOCA'):
            return Categories.BIKE

    def parse_csv(self):
        return []
