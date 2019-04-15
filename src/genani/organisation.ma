type Attribute:
    abstract object: value
    abstract object: name

type Member is ScriptHash | Address:
    Attribute[]: attributes

type Organisation is Member:
    Member[]: members

type AttributeRegister is Attribute[string]:
    override add():
        pass

type IsDirector is Attribute:
    object: name = "is-director"

type IsExternal is Attribute:
    object: name = "is-external"

static OrganisationRegister is Organisation[string]:
    Organisation: root
    AttributeRegister: attributeRegister = new AttributeRegister()
    add(Organisation: org):
        pass
    setRoot(Organisation: org{in this}):
        this.root = org
    constructor():
        this.attributeRegister.add("is-director", IsDirector)
        this.attributeRegister.add("is-external", IsExternal)
    
