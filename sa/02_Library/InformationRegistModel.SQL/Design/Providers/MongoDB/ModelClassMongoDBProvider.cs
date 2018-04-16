using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.DataModel.Database;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/13 10:02:49
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Design.Providers.MongoDB
{
    /// <summary>
    /// 
    /// </summary>
    public class ModelClassMongoDBProvider : MongoDBModelProvider<ModelClass>, IModelClassDAL
    {
    }
}
