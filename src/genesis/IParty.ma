type IParty:
    Address[]: members
    abstract void: create(witnessed Address:address): pass
    abstract void: add(Address:address, witnessed Address[]:witnesses{in members}): pass
    abstract void: remove(Address:address, witnessed Address[]:witnesses{in members}): pass
    abstract void: resign(witnessed Address:address{in members}): pass