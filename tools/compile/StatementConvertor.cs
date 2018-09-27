using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

public class StatementConvertor : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        throw new NotImplementedException();
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        var jobject = JObject.Load(reader);
        var typename = jobject.GetValue("__TYPE__").ToString();
        var type = Type.GetType(typename);
        var instance = Activator.CreateInstance(type);
        serializer.Populate(jobject.CreateReader(), instance);
        return instance;
    }

    bool CannotWrite { get; set; }

    public override bool CanWrite { get { return !CannotWrite; } }
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {       
        JToken t;
        using (new PushValue<bool>(true, () => CannotWrite, (canWrite) => CannotWrite = canWrite))
        {
            t = JToken.FromObject(value, serializer);
        }
        if (t.Type != JTokenType.Object)
        {
            serializer.Serialize(writer, value, typeof(object));
            return;
        }
        if(!((JObject)t).ContainsKey("__TYPE__"))
            ((JObject)t).AddFirst(new JProperty("__TYPE__", value.GetType().Name));
        t.WriteTo(writer);
    }
}


public struct PushValue<T> : IDisposable
{
    Func<T> getValue;
    Action<T> setValue;
    T oldValue;

    public PushValue(T value, Func<T> getValue, Action<T> setValue)
    {
        if (getValue == null || setValue == null)
            throw new ArgumentNullException();
        this.getValue = getValue;
        this.setValue = setValue;
        this.oldValue = getValue();
        setValue(value);
    }

    #region IDisposable Members

    // By using a disposable struct we avoid the overhead of allocating and freeing an instance of a finalizable class.
    public void Dispose()
    {
        if (setValue != null)
            setValue(oldValue);
    }

    #endregion
}