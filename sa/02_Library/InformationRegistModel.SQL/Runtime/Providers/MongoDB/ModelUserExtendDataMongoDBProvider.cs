using LeadingCloud.Framework;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Components;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Interfaces;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.MISPT.Framework.Database.Utils;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Runtime.Providers.MongoDB
{
    /// <summary>
    /// 
    /// </summary>
    public class ModelUserExtendDataMongoDBProvider : MongoDBModelProvider<ModelUserExtendConfig>, IModelUserExtendConfigDAL
    {
        /// <summary>
        /// 【运行时】获取用户配置的列表
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sceneOrgId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<ModelUserExtendFieldConfig> GetModulUserFields(string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            IMongoCollection<ModelUserExtendConfig> collection = this.CreateMongoCollection<IMongoCollection<ModelUserExtendConfig>>();
            FilterDefinition<ModelUserExtendConfig> filter = Builders<ModelUserExtendConfig>.Filter.Eq("BusinessModuleId", businessModuleId) & Builders<ModelUserExtendConfig>.Filter.Eq("SceneCode", sceneCode) & Builders<ModelUserExtendConfig>.Filter.Eq("SceneOrgId", sceneOrgId);
            ModelUserExtendConfig Data = collection.Find(filter).FirstOrDefault();
            List<ModelUserExtendFieldConfig> list = new List<ModelUserExtendFieldConfig>();
            if (Data != null && Data.FormConfig != null)
            {
                for (int i = 0; i < Data.FormConfig.Fields.Count; i++)
                {
                    list.Add(Data.FormConfig.Fields[i]);
                }
            }
            //if (list.Any() == false) return null;
            return list;
        }


        /// <summary>
        /// 根据业务模块id获取用户扩展配置属性
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="sceneOrgId"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public ModelUserExtendConfig GetData(string businessModuleId, string sceneCode, string sceneOrgId, IServerContext sc)
        {
            var tableAttr = DbModelHelper.GetDbTableAttribute<ModelUserExtendConfig>();
            IMongoCollection<ModelUserExtendConfig> collection = this.CreateMongoCollection<IMongoCollection<ModelUserExtendConfig>>();
            FilterDefinition<ModelUserExtendConfig> filter = Builders<ModelUserExtendConfig>.Filter.Eq("BusinessModuleId", businessModuleId) & Builders<ModelUserExtendConfig>.Filter.Eq("SceneCode", sceneCode) & Builders<ModelUserExtendConfig>.Filter.Eq("SceneOrgId", sceneOrgId);
            ModelUserExtendConfig Data = collection.Find(filter).FirstOrDefault();
            return Data;
        }
    }
}
