using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using MongoDB.Driver;
using LeadingCloud.MISPT.InformationRegistModel.SQL.Utils;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 10:47:52
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】模块配置数据访问MongoDB提供程序
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Design.Providers.MongoDB
{
    /// <summary>
    /// 【信息登记模型】模块配置数据访问MongoDB提供程序
    /// </summary>
    public class ModelConfigLogMongoDBProvider:MongoDBModelProvider<ModelConfigLog>,  IModelConfigLogDAL
    {
        
    }
}
