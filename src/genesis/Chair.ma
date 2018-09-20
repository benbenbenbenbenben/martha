type Chair:
    is: IToken
    storage timestamp[Address]: sanctioned
    storage timestamp[Address]: chairs
    storage uint: maxChairs = 7
    timestamp[Address]: allmembers => sanctioned + chairs
    string name():
        "Chair"
    string symbol():
        "GOV"
    byte decimal():
        0
    uint totalSupply():
        maxChairs
    number balanceOf(Address:address):
        chairs[address] ? 1 : 0
    bool transfer(witnessed Address:from, Address:to{in accounts}, number:amount{> 0}):
        false
    uint vacantSeats():
        totalSupply() - (chairs.len + sanctioned.len)
    bool resign(witnessed Address:address):
        if address in sanctioned:
            delete sanctioned[address]
            return true
        if address in chairs:
            delete chairs[address]
            return true
        return false
    bool add(witnessed Address:address{stake > 0 && not in allmembers}, executor Stake:caller{== stakeholders}):
        if vacantSeats() > 0:
            chairs[address] = getTimestamp()
            return true
        return false
    @syscall("dcdc.stakeholders")
    extern Stake stakeholders(): pass