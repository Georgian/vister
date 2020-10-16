class Transaction:
    def __init__(self, args=None, completed_date=None, category=None, reference=None, debit=None, credit=None,
                 currency=None, source=None, ron_fx_rate=None, comment=None):
        if args is not None:
            self.completed_date = args[0]
            self.category = args[1]
            self.reference = args[2]
            self.debit = args[3]
            self.credit = args[4]
            self.currency = args[5]
            self.source = args[6]
            self.ron_fx_rate = args[7]
        else:
            self.completed_date = completed_date
            self.category = category
            self.reference = reference
            self.debit = debit
            self.credit = credit
            self.currency = currency
            self.source = source
            self.ron_fx_rate = ron_fx_rate


class SheetRow:
    def __init__(self, row_nbr, transaction):
        self.row_nbr = row_nbr
        self.transaction = transaction


class Categories:
    SELF_TRANSFER = 'Self-transfer'
    SALARY = 'Salary'
    HOUSE = 'House'
    SUBSCRIPTIONS = 'Subscriptions'
    CAR = 'Car'
    BIKE = 'Bike'