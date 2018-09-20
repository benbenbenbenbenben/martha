import dcdc

machine:
    genesis_contract
is:
    command_contract
with:
    int:FC = 7
    Founder[]:founders
start:
    genesis

state genesis:
    export critical void registerChair(address:addr) -> awaitingChair:
        registerChair(addr)
        initNetAccount()
        redeemNetCurrency()
    
    export void default -> unknownCommand:

state awaitingFounders:
    export critical void setFounderCount(uint:c) -> awaitingChair:
        if c > 0: FC = c
    
    export void default -> unknownCommand:

state unknownCommand:
    log(previous state + " received an unknown command")
    goto previous state

Founder? get chairPerson():
    founders.first(f => f.ischairperson)?

critical void registerChair(address:addr):
    if chairPerson: throw "chairperson is already registered"
    founders.push(Founder addr)

critical void initNetAccount(address:addr):
    let redeem = dcdc.system.issueCurrency("STK", "Stake", 100000000)
    execute(redeem)

critical void initNetAccount():



