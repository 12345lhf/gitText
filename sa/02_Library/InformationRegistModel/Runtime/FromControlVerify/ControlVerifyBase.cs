using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces;
using MongoDB.Bson;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/3 9:19:11
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.FromControlVerify
{
    /// <summary>
    /// 控件验证基类
    /// </summary>
    public abstract class ControlVerifyBase : IControlVerify
    {
        /// <summary>
        /// 配置信息
        /// </summary>
        public BsonDocument ControlConfigJson { get; private set; }
        /// <summary>
        /// 字段名
        /// </summary>
        public string FieldName { get; private set; }
        /// <summary>
        /// 字段编码
        /// </summary>
        public string FieldCode { get; private set; }
        /// <summary>
        /// 控件验证基类
        /// </summary>
        /// <param name="fieldConfigJson"></param>
        public ControlVerifyBase(string fieldConfigJson)
        {
            BsonDocument doc = BsonDocument.Parse(fieldConfigJson);
            this.FieldCode = doc["FieldCode"].AsString;
            this.FieldName = doc["FieldName"].AsString;
            var controlConfig = doc["ControlConfig"];
            string config = "";
            if (controlConfig != BsonNull.Value)
            {
                config = doc["ControlConfig"].AsString;
            }
            this.ControlConfigJson = string.IsNullOrEmpty(config) ? new BsonDocument() : BsonDocument.Parse(config);
        }


        /// <summary>
        /// 验证方法
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public abstract ControlVerifyResult Verify(object value);
    }
}
