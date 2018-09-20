import dcdc

tag Rights:
    Vote
    Chair
    Veto

type: 
    Stakeholder
is: 
    Address
with: 
    Rights.Vote

type:
    Representative
is:
    Stakeholder

type:
    Chairperson
is:
    Representative
with:
    Rights.Chair
    Rights.Veto

machine:
    genesis_contract
is:
    smart_contract
with:
    Stakeholder[]: stakeholders
    Representative*: representatives => stakeholders.filter(isa Representative)    
    Chairperson*: chairpersons => stakeholders.filter(isa Chairperson)
start:
    configure
state configure:
    export critical void addChairperson(Address:addr):
        chairs.include(addr)
    export critical void addVeto(Address:addr):
        vetos.include(addr)
    export critical void addFounder(Address:addr):
        founders.include(addr)
    export critical void majority(uint:m{> 0 && <= addresses.len}):
        majority = m
    export critical lock() -> register:
        assert(chairs.len > 0)
state register:


