type IToken:
    string name(): pass
    string symbol(): pass
    byte decimals(): pass
    uint totalSupply(): pass
    number balanceOf(Address:address): pass
    bool transfer(witnessed Address:from, Address:to, number:amount): pass