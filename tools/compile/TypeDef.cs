using System;
using System.Linq;
using Mono.Cecil;
using Mono.Cecil.Cil;

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
        } else {
            type.BaseType = compilation.Module.TypeSystem.Object;
        }
        foreach (var member in members)
        {
            member.Visit(compilation, this, type);
        }
        
        // empty ctor
        var methodAttributes = MethodAttributes.Public | MethodAttributes.HideBySig | MethodAttributes.SpecialName | MethodAttributes.RTSpecialName;
        var method = new MethodDefinition(".ctor", methodAttributes, compilation.Module.TypeSystem.Void);
        method.Body.Instructions.Add(Instruction.Create(OpCodes.Ldarg_0));
        var methodRef = new MethodReference(".ctor", compilation.Module.TypeSystem.Void, type.BaseType)
        {
            HasThis = true
        };
        method.Body.Instructions.Add(Instruction.Create(OpCodes.Call, methodRef));
        method.Body.Instructions.Add(Instruction.Create(OpCodes.Ret));
        type.Methods.Add(method);

        compilation.AddType(type);
    }
}