
type Attribute:
    abstract object: value
    abstract object: name

type Member:
    ScriptHash: address
    Attribute[]: attributes

type Organisation:
    Member[]: members

type AttributeRegister is Attribute[string]:
    override add():
        pass

static type OrganisationRegister is Organisation[string]:
    static AttributeRegister: attributeRegister = new AttributeRegister()
    override add():
        pass
    constructor():
        this.attributeRegister.add("is-director", IsDirector)
        this.attributeRegister.add("is-external", IsExternal)
    

type IsDirector is Attribute:
    pass
type IsExternal is Attribute:
    pass