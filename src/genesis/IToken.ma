type IToken:
    abstract string: name(): pass
    abstract string: symbol(): pass
    abstract byte: decimals(): pass
    abstract uint: totalSupply(): pass
    abstract number: balanceOf(Address:address): pass
    abstract bool: transfer(witnessed Address:from, Address:to, number:amount): pass