import OrganisationRegister from organisation

type Genesis:
    static Organisation: root
    static ScriptHash => witnessed boolean: unlockScript
    constructor() -> unlocked:
        root = new Organisation
    state unlocked:
        void: addAdministrator(Member: admin):
            admin.attributes.add (new OrganisationRegister.attributeRegister["is-director"]{
                value = true
            })
            root.members.add admin
        witnessed void: lock(ScriptHash => witnessed boolean: unlock_script) -> locked:
            witnessed(this.root.members, this.root.members.length):
                this.unlockScript = unlock_script
                OrganisationRegister.add root
                OrganisationRegister.setRoot root
    state locked:
        witnessed void: upgradeUnlockScript(ScriptHash => witnessed boolean: new_unlock_script):
            witnessed(this.unlockScript){  
                this.unlockScript = new_unlock_script
            }