using System;
using System.Linq;
using System.Numerics;
using Mono.Cecil;
using Mono.Cecil.Cil;
internal class Compilation
{
    private AssemblyDefinition asm;
    private ModuleDefinition mod;

    public Compilation()
    {        
        asm = Mono.Cecil.AssemblyDefinition.CreateAssembly(new AssemblyNameDefinition("test", new System.Version(1,1)), "mod", ModuleKind.Dll);
        mod = asm.Modules.First();
        /*
        var t1 = new TypeDefinition("default", "Type1", TypeAttributes.Public);
        var m1 = new MethodDefinition("test", MethodAttributes.Public | MethodAttributes.Static, mod.TypeSystem.String);
        m1.Body.GetILProcessor().Emit(OpCodes.Ldstr, "hello");
        m1.Body.GetILProcessor().Emit(OpCodes.Ret);
        t1.Methods.Add(m1);
        mod.Types.Add(t1);
        asm.Write("foo.dll");
        */
    }

    internal void AddType(TypeDefinition type)
    {
        mod.Types.Add(type);
    }

    internal TypeReference GetTypeReference(TypeRef basetype)
    {
        // flags
        bool isarray = false;
        bool isdictionary = false;
        //

        if (basetype.indexer.Length > 0) {
            if (basetype.indexer[0].nameref.Length == 0) {
                isarray = true;
            } else {
                isdictionary = true;
                foreach (var keytype in basetype.indexer) {
                    var keytyperef = GetTypeReference(keytype);
                    
                }
            }
        }
        var typename = basetype.nameref.Last().name.value;
        TypeReference outref = new TypeReference("default", typename, mod, mod);

        switch(typename) {
            case "string":
            outref = mod.TypeSystem.String;
            break;
            case "boolean":
            case "bool":
            outref = mod.TypeSystem.Boolean;
            break;
            case "uint32":
            case "uint":
            outref = mod.TypeSystem.UInt32;
            break;
            case "number":
            case "timestamp":
            outref = mod.ImportReference(typeof(BigInteger));
            break;
        }
        /*
        var types = mod.GetTypeReferences();
        var f = types.FirstOrDefault(t => t.Name == basetype.nameref.Last().name.value && t.Namespace == "default");
        if (f == null) {

        }
        return f;
        */
        if (isarray) {
            outref = new ArrayType(outref);
        }
        return outref;
    }

    internal void Save(string filename)
    {
        asm.Write(filename);
    }
}