using System.Collections.Generic;
using Mono.Cecil;

public static class Extensions {
    public static FieldAttributes ToFieldAttributes(this IEnumerable<Token> tokens)
    {
        FieldAttributes attr = default(FieldAttributes);
        foreach(var token in tokens) {
            switch(token.value) {
                case "public": 
                attr |= FieldAttributes.Public;
                break;
                case "private":
                attr |= FieldAttributes.Private;
                break;
                case "static":
                attr |= FieldAttributes.Static;
                break;
            }
        }
        return attr;
    }
}