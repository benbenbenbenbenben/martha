using System;
using System.Linq;
using Mono.Cecil;

public class TypeDef {
    public string __TYPE__ => this.GetType().Name;
    public Token name;
    public TypeRef basetype;
    public MemberDef[] members;
    public MethodDef[] methods;

    internal void Visit(Compilation compilation)
    {
        var type = new TypeDefinition("default", name.value, TypeAttributes.Public);
        if (basetype != null) {
            type.BaseType = compilation.GetTypeReference(basetype);
        }
        foreach (var member in members)
        {
            member.Visit(compilation, this, type);
        }
        compilation.AddType(type);
    }
}