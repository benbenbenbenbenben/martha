import OrganisationRegister from organisation

machine Genesis:
    static root: Organisation
    static unlockScript: witnessed ScriptHash => boolean
    constructor() -> unlocked:
        root = new Organisation
    state unlocked:
        void addAdministrator(admin:Member):
            pass
        constructor():
            pass

