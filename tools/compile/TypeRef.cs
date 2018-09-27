public class TypeRef
{
    public string __TYPE__ => this.GetType().Name;
    public Reference[] nameref;
    public TypeRef[] indexer;
    public TypeRef[] types;
}