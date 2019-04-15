import OrganisationRegister from organisation
import Genesis from genesis

let genesis = new Genesis

let simple_majority_unlock = witnessed (Organisation: org):
    witnessed(org.members, roundup(org.members.length / 2)){
        return true
    }

genesis.addAdministrator "ff00112233445566778800112233445566778899"
genesis.addAdministrator "ff00112233445566778800112233445566778899"
genesis.addAdministrator "ff00112233445566778800112233445566778899"
genesis.addAdministrator "ff00112233445566778800112233445566778899"

genesis.lock(simple_majority_unlock)

metadata:
    owner = () => genesis.getOwner
    administrator = () => genesis.getAdministrator
