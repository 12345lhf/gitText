using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.Framework.Database.Interfaces;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 10:03:50
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】模块配置修改的日志记录数据访问接口
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces
{
    /// <summary>
    /// 【信息登记模型】模块配置修改的日志记录数据访问接口
    /// </summary>
    public interface IModelConfigLogDAL: IDbModelDAL<ModelConfigLog>
    {
       
    }
}
