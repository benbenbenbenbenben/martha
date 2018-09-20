type IParty:
    Address[]: members
    void create(witnessed Address:address): pass
    void add(Address:address, witnessed Address[]:witnesses{in members}): pass
    void remove(Address:address, witnessed Address[]:witnesses{in members}): pass
    void resign(witnessed Address:address{in members}): pass