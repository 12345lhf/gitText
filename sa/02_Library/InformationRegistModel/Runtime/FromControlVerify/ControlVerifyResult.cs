using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/3 10:40:34
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.FromControlVerify
{
    /// <summary>
    /// 
    /// </summary>
    public class ControlVerifyResult
    {
        /// <summary>
        /// 返回值，ErrorCode=0为成功
        /// </summary>
        public ControlVerifyResult()
        {
            this.ErrorCode = "0";
        }
        /// <summary>
        /// 错误编码（0为成功）
        /// </summary>
        public string ErrorCode { get; set; }
        /// <summary>
        /// 信息
        /// </summary>
        public string Message { get; set; }
    }
}
