type Attribute =
    abstract value
    abstract name

type Member is ScriptHash | Address:
    Attribute[]: attributes

type Organisation is Member =
    members: Member[]

type AttributeRegister is Attribute[string]

type IsDirector is Attribute =
    name = "is-director"

type IsExternal is Attribute =
    name = "is-external"

static OrganisationRegister is Organisation[string] =
    root: Organisation
    attributeRegister = new AttributeRegister()
    add org =
        pass
    setRoot org: Organisation{in this} =
        this.root = org
    new =
        this.attributeRegister.add("is-director", IsDirector)
        this.attributeRegister.add("is-external", IsExternal)
    
