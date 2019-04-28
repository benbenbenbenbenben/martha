import OrganisationRegister from organisation

macro witnessed for $typedef =
    as foo =
        pass

 
machine Genesis =
    static root: Organisation
    static unlockScript: boolean(ScriptHash)
    new -> unlocked = 
        Genesis.root = new Organisation
    state unlocked =
        addAdministrator admin:Member =
            admin.attributes.add(new OrganisationRegister.attributeRegister["is-director"]{
                value = true
            })
            Genesis.root.members.add admin
        lock unlock_script -> locked =
            Genesis.unlockScript = unlock_script
            OrganisationRegister.add Genesis.root
            OrganisationRegister.setRoot Genesis.root
    state locked =
        upgradeUnlockScript new_unlock_script =
            Genesis.unlockScript = new_unlock_script
        addAdministrator admin:Member =
            pass