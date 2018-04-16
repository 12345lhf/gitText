using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.Framework.Database.Components;
using MongoDB.Driver;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/4/7 11:07:16
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.SQL.Design.Providers.MongoDB
{
    /// <summary>
    /// 
    /// </summary>
    public class ControlMongoDBProvider : MongoDBModelProvider<ControlEntity>, IControlDAL
    {
        /// <summary>
        /// 获取所有控件列表
        /// </summary>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<ControlEntity> GetControlList(IServerContext sc)
        {
            IMongoCollection<ControlEntity> collection = this.CreateMongoCollection<IMongoCollection<ControlEntity>>();
            FilterDefinition<ControlEntity> all = Builders<ControlEntity>.Filter.Empty;
            var list = collection.Find(Builders<ControlEntity>.Filter.And(all)).ToList();
            return list;
        }

        /// <summary>
        /// 获取用户控件列表
        /// </summary>
        /// <param name="userId">用户id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回用户+默认控件集合，否则返回null</returns>
        public List<ControlEntity> GetUserControlList(string userId, IServerContext sc)
        {
            if (string.IsNullOrEmpty(userId)) { return new List<ControlEntity>(); }

            IMongoCollection<ControlEntity> collection = this.CreateMongoCollection<IMongoCollection<ControlEntity>>();
            FilterDefinition<ControlEntity> isDefaultFilter = Builders<ControlEntity>.Filter.Eq("IsDefault", true);
            FilterDefinition<ControlEntity> userIdFilter = Builders<ControlEntity>.Filter.Eq("AddUserId", userId);
            List<FilterDefinition<ControlEntity>> allFilter = new List<FilterDefinition<ControlEntity>>();
            allFilter.Add(isDefaultFilter);
            allFilter.Add(userIdFilter);
            FilterDefinition<ControlEntity> all = Builders<ControlEntity>.Filter.Or(allFilter);
            var list = collection.Find(Builders<ControlEntity>.Filter.And(all)).ToList();
            return list;
        }

        /// <summary>
        /// 根据编码批量获取控件列表
        /// </summary>
        /// <param name="codes">控件编码集合</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合</returns>
        public List<ControlEntity> GetControlsByCode(List<string> codes, IServerContext sc)
        {
            IMongoCollection<ControlEntity> collection = this.CreateMongoCollection<IMongoCollection<ControlEntity>>();
            FilterDefinition<ControlEntity> all = Builders<ControlEntity>.Filter.In("Code", codes);
            var list = collection.Find(Builders<ControlEntity>.Filter.And(all)).ToList();
            return list;
        }
    }
}
