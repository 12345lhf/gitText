using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.Framework.Database.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.Framework;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/4/7 10:52:15
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces
{
    /// <summary>
    /// 控件操作接口
    /// </summary>
    public interface IControlDAL : IDbModelDAL<ControlEntity>
    {
        /// <summary>
        /// 获取所有控件接口
        /// </summary>
        /// <param name="sc"></param>
        /// <returns></returns>
        List<ControlEntity> GetControlList(IServerContext sc);
        /// <summary>
        /// 根据编码批量获取控件列表
        /// </summary>
        /// <param name="codes">控件编码集合</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合</returns>
        List<ControlEntity> GetControlsByCode(List<string> codes, IServerContext sc);
        /// <summary>
        /// 获取用户控件列表
        /// </summary>
        /// <param name="userId">用户id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回用户+默认控件集合，否则返回null</returns>
        List<ControlEntity> GetUserControlList(string userId, IServerContext sc);
    }
}
