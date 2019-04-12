using System;
using System.Linq;
using Mono.Cecil;

public class MemberDef
{
    public string __TYPE__ => this.GetType().Name;
    public TypeRef type;
    public Token name;
    public Statement[] getter;
    public Statement[] setter;

    internal void Visit(Compilation compilation, TypeDef typeDef, TypeDefinition type)
    {
        var field = new FieldDefinition(
            name: name.value,
            attributes: FieldAttributes.Private,
            fieldType: compilation.GetTypeReference(this.type)
        );
        field.Attributes = this.type.nameref.Reverse().Skip(1).Select(r => r.name).ToFieldAttributes();
        if (field.Attributes == FieldAttributes.CompilerControlled) {
            field.Attributes = FieldAttributes.Private;
        }
        if (getter.Length > 0 || setter.Length > 0) {

        }
        type.Fields.Add(field);
    }
}