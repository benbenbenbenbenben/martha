machine:
    Stakeholder
with:
    Address: this
    Right[]: rights = [Right.Vote]
    Duty[]: duties
    stakeholder[]: introducers
    Contract[]: controllers
    uint: introducermajority => introducers.len - 1
    uint: governermajority => governers.len - 1
start:
    genesismode ? new : genesis
state genesis:
    void init(Address:address) -> active:
        this = address
state new:
    void init(Address:address, signed Stakeholder[]:introducers{.len > 0 && .all(isactive)}) -> active:
        this = address
        this.introducers = introducers
        register(this)
state active:
state frozen:
state relinquished:
state locked:
    state byintroducers, byowner:
        void transfer(Address:address, signed Stakeholder[]:majority{.len > introducermajority && introducers.contains}) -> active:
            this = address
    state bysystem:
        void transfer(Address:address, signed Governer[]:majority{.len > governermajority && governers.contains}) -> active:
            this = address
void lock(signed Contract:controller{.any(controllers)}) -> locked.*:
    match controller:
        signed by this: goto locked.byowner
        signed by governers: goto locked.bysystem
        signed by introducers: goto locked.byintroducers


static bool genesismode => stakeholdercount() == 0

@syscall("genesis.stakeholder.register")
static extern void register()

@syscall("genesis.stakeholder.count")
static extern uint stakeholdercount()

@syscall("genesis.stakeholder.isactive")
static extern bool isactive(Address:address)

@syscall("genesis.governers")
static extern Governer governers()