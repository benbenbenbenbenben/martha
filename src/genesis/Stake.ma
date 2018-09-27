type Stake is IToken:
    storage number[Address]: accounts
    storage ITxHook[Address]: beforetxout
    storage ITxHook[Address]: beforetxin
    storage ITxHook: beforetx
    constructor():
        registerSysCall("dcdc.stakeholders", this)
    string: name(): 
        "Stake"
    string: symbol():
        "STK"
    byte: decimals():
        0
    uint: totalSupply():
        100 000 000
    number: balanceOf(Address:address):
        account[address]
    bool: transfer(witnessed Address:from{in accounts}, Address:to{in accounts}, number:amount{> 0}):
        if beforetx && beforetx(from, to, amount) == false:
            return false
        if beforetxout[from] && beforetxout[from](from, to, amount) == false:
            return false
        if beforetxin[to] && beforetxin[to](from, to, amount) == false:
            return false
        if accounts[from] < amount:
            return false
        if accounts[from] == amount:
            delete accounts[from]
        else:
            accounts[from] -= amount
            accounts[to] += amount
        return true
    bool: allmemberballot(witnessed Address:invoker{in accounts && workBalanceOf >= ballotCost}, IBallot:ballot):
        registerBallot(ballot)
        
    @syscall("dcdc.system.registerSysCall")
    extern bool: registerSysCall(string:name, function:f): pass
    @syscall("dcdc.stakeholders.workBalanceOf")
    extern number: workBalanceOf(Address:address): pass
    @syscall("dcdc.ballot.cost")
    extern number: ballotCost(): pass
    @syscall("dcdc.ballot.register")
    extern bool: registerBallot(): pass