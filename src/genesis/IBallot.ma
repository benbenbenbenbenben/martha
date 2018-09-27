type IBallot:
    ScriptHash[]: ballot
    abstract string: name(witnessed string:foo): pass
    abstract string: description(): pass
    abstract drl[]: references(): pass
    abstract bool: revert(witnessed Address:voter): pass
    abstract bool: cast(witnessed Address:voter, uint:weight, ScriptHash:selection{in ballot}): pass
    abstract bool: delegate(witnessed Address:voter, uint:weight, Address:delegate): pass

