using LeadingCloud.MISPT.InformationRegistModel.Runtime.FromControlVerify;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/3 8:59:05
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces
{
    /// <summary>
    /// 
    /// </summary>
    public interface IControlVerify
    {
        /// <summary>
        /// 属性验证
        /// </summary>
        /// <param name="value">实际值</param>
        /// <returns></returns>
        ControlVerifyResult Verify(object value);
    }
}
