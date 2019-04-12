type JuppChannel:
    Address: owner
    Address: thirdparty
    byte[][]: inbox
    byte[][]: outbox
    identity: identity => owner + thirdparty

type JuppChannels:
    storage JuppChannel[]: channels

    open(witnessed Address:thirdparty):
        pass
    free close(witnessed Address:owner):
        pass
    free reopen(witnessed Address:owner):
        pass
    send(witnessed Address: sender, Address recipient):
        pass