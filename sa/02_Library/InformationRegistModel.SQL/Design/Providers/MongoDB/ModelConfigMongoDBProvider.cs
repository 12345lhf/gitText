using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Enumerations;
using LeadingCloud.MISPT.InformationRegistModel.SQL.Utils;
using MongoDB.Driver;
using MongoDB.Bson;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.MISPT.Framework.Database.Utils;

/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 10:47:52
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】模块配置数据访问MongoDB提供程序
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Design.Providers.MongoDB
{
    /// <summary>
    /// 【信息登记模型】模块设计时配置数据访问MongoDB程序
    /// </summary>
    public class ModelDesignDataDbProvider : MongoDBModelProvider<ModelDesignData>, IModelDesignDataDAL
    {
        /// <summary>
        /// 【设计时】获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        public List<ModelDesignData> GetDesignDataList(IServerContext sc)
        {
            var tableAttr = DbModelHelper.GetDbTableAttribute<ModelDesignData>();
            IMongoCollection<ModelDesignData> collection = this.CreateMongoCollection<IMongoCollection<ModelDesignData>>();

            List<SortDefinition<ModelDesignData>> sorts = new List<SortDefinition<ModelDesignData>>();
            sorts.Add(Builders<ModelDesignData>.Sort.Descending("AddTime"));
            SortDefinition<ModelDesignData> sort = Builders<ModelDesignData>.Sort.Combine(sorts);
            List<ModelDesignData> list = collection.Find(new BsonDocument()).Sort(sort).ToList();
            if (list.Any() == false) return new List<ModelDesignData>();
            return list;
        }
    }

    /// <summary>
    /// 【信息登记模型】模块发布后的配置数据访问MongoDB程序
    /// </summary>
    public class ModelPublishDataDbProvider : MongoDBModelProvider<ModelPublishData>, IModelPublishData
    {

    }
}
