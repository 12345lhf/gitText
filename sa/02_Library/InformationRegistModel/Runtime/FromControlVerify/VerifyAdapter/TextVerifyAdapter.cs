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
 * 创建日期：2017/3/3 9:15:40
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.FromControlVerify
{
    /// <summary>
    /// 文本框验证
    /// </summary>
    public class TextVerifyAdapter : ControlVerifyBase
    {
        /// <summary>
        /// 文本框验证
        /// </summary>
        /// <param name="configJson">属性配置信息</param>
        public TextVerifyAdapter(string configJson) : base(configJson)
        {
        }
        /// <summary>
        /// 验证
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public override ControlVerifyResult Verify(object value)
        {
            ControlVerifyResult result = new ControlVerifyResult();
            //检查必填
            BsonValue defaultRequired = new BsonBoolean(false);
            this.ControlConfigJson.TryGetValue("IsRequired", out defaultRequired);
            if (defaultRequired != null)
            {
                if (defaultRequired.AsBoolean == true)
                {
                    if (string.IsNullOrEmpty(value.ToString()))
                    {
                        result.ErrorCode = "error";
                        result.Message = string.Format("字段{0}不能为空！", this.FieldCode);
                    }
                }
            }
            //检查长度
            BsonValue defaultLength = new BsonInt32(0);
            this.ControlConfigJson.TryGetValue("Length", out defaultLength);
            if (defaultLength != null)
            {
                if (defaultLength.IsInt32 == true && defaultLength.AsInt32>0)
                {
                    if (value.ToString().Length > defaultLength.AsInt32)
                    {
                        result.ErrorCode = "error";
                        result.Message = string.Format("字段{0}长度不能超过{1}！", this.FieldCode, defaultLength.AsInt32);
                    }
                }
            }
            return result;
        }
    }
}