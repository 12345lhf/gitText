using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.Framework.ModuleBase;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;
using LeadingCloud.MISPT.DataModel.Database;
using LeadingCloud.MISPT.DataModel.Database.Enumerations;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/13 9:08:18
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design
{
    /// <summary>
    /// 
    /// </summary>
    public class ModelClassManager : ModuleManager
    {
        #region 属性

        /// <summary>
        /// Manager实例
        /// </summary>
        public static ModelClassManager Instance { private set; get; }

        /// <summary>
        /// 应用编码
        /// </summary>
        public override string AppCode { get { return Const.AppCode; } }

        /// <summary>
        /// 静态构造方法
        /// </summary>
        [MethodImpl(MethodImplOptions.Synchronized)]
        static ModelClassManager()
        {
            //      静态实例，只初始化一次
            if (Instance == null) Instance = new ModelClassManager();
        }

        #endregion


        #region 对外接口

        #region 增加
        /// <summary>
        /// 新增分类
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public ModelClass Add(ModelClass entity, IServerContext sc)
        {
            Func<ModelClass> func = () =>
           {
               if (entity == null) ThrowErrorCodeException("数据对象为空");
               if (String.IsNullOrEmpty(entity.Name)) ThrowArgException("分类名称不能为空");
               if (String.IsNullOrEmpty(entity.Id)) entity.Id = Guid.NewGuid().ToString();


               ServerContextInfo scInfo = GetServerContextInfo(sc);

               if (IsHasName(entity.Name, sc))
               {
                   ThrowErrorCodeException("分类名称已经存在");
               }

               entity.CreateTime = DateTime.Now;
               entity.CreateUserId = scInfo.UserId;
               entity.CreateOrganizationId = scInfo.OrgId;

               entity = this.GetDAL<IModelClassDAL>(sc).SaveData(entity, sc);
               return entity;
           };
            return this.CallFunc<ModelClass>(func, sc, "Add", "保存分类失败");
        }

        #endregion

        #region 修改
        /// <summary>
        /// 修改分类
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public ModelClass Update(ModelClass entity, IServerContext sc)
        {
            Func<ModelClass> func = () =>
           {
               if (entity == null) ThrowErrorCodeException("数据对象为空");
               if (String.IsNullOrEmpty(entity.Name)) ThrowArgException("分类名称不能为空");
               if (String.IsNullOrEmpty(entity.Id)) ThrowArgException("分类编码不能为空");

               ServerContextInfo scInfo = GetServerContextInfo(sc);
               var serverModel = this.GetDAL<IModelClassDAL>(sc).LoadData(entity.Id, sc);
               if (serverModel == null || string.IsNullOrEmpty(serverModel.Id))
               {
                   ThrowArgException("修改的分类不存在");
               }
               if (IsHasNameExcludeOneself(entity, sc))
               {
                   ThrowArgException("分类名称已经存在");
               }
               //赋值
               serverModel.Name = entity.Name;
               entity = this.GetDAL<IModelClassDAL>(sc).SaveData(serverModel, sc);
               return entity;
           };
            return this.CallFunc<ModelClass>(func, sc, "Update", "修改分类失败");
        }

        #endregion

        #region 删除
        /// <summary>
        /// 删除分类
        /// </summary>
        /// <param name="id"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public bool Delete(string id, IServerContext sc)
        {
            Func<bool> func = () =>
           {
               if (String.IsNullOrEmpty(id)) ThrowArgException("分类编码不能为空");
               ServerContextInfo scInfo = GetServerContextInfo(sc);

               //判断是否可以删除
               List<ModelDesignData> modelList = ModelDesignManager.Instance.GetDesignDataListByUserAndClass(id, sc);
               int? count = modelList?.Count;
               if (count != null && count > 0)
               {
                   ThrowArgException("分类中存在模块，不能删除！");
               }

               IModelClassDAL dal = this.GetDAL<IModelClassDAL>(sc);
               return dal.DeleteData(id, sc);
           };
            return this.CallFunc<bool>(func, sc, "Delete", "删除分类失败");
        }
        #endregion

        #region 查询
        /// <summary>
        /// 获取分类列表
        /// </summary>
        /// <param name="sc"></param>
        /// <returns></returns>
        public List<ModelClass> GetUserClassList(IServerContext sc)
        {
            Func<ServerContextInfo, List<ModelClass>> func = (scinfo) =>
            {

                DbQuerySetting qs = new DbQuerySetting();
                //where条件
                DbQueryFieldGroupSetting where = new DbQueryFieldGroupSetting();
                where.FieldCondition = new List<DbQueryFieldSetting>();
                //根据用户过滤
                where.FieldCondition.Add(new DbQueryFieldSetting()
                {
                    Name = "CreateUserId",
                    Value = scinfo.UserId,
                    DataType = DbQueryFieldDataType.String,
                    QueryType = DbQueryType.Equal
                });
                List<DbQueryFieldGroupSetting> listWhere = new List<DbQueryFieldGroupSetting>();
                listWhere.Add(where);

                List<DbQueryOrderSetting> listOrder = new List<DbQueryOrderSetting>();
                //按创建时间排序
                listOrder.Add(new DbQueryOrderSetting()
                {
                    Name = "CreateTime",
                    IsASC = true
                });

                qs.WhereCondition = listWhere;
                qs.OrderSetting = listOrder;

                return this.GetDAL<IModelClassDAL>(sc).LoadDatas(qs, sc);
            };
            return this.CallFuncForContextInfo<List<ModelClass>>(func, sc, "GetUserClassList", "获取用户模块分类列表失败");
        }
        #endregion

        #endregion

        #region 私有辅助


        /// <summary>
        /// 判断分类明是否已经存在（按用户过滤）
        /// </summary>
        /// <param name="name"></param>
        /// <param name="sc"></param>
        /// <returns></returns>

        private bool IsHasName(string name, IServerContext sc)
        {
            Func<ServerContextInfo, bool> func = (scinfo) =>
            {
                DbQuerySetting qs = new DbQuerySetting();
                //where条件
                DbQueryFieldGroupSetting where = new DbQueryFieldGroupSetting();
                where.FieldCondition = new List<DbQueryFieldSetting>();
                //根据用户过滤
                where.FieldCondition.Add(new DbQueryFieldSetting()
                {
                    Name = "Name",
                    Value = name,
                    DataType = DbQueryFieldDataType.String,
                    QueryType = DbQueryType.Equal
                });

                where.FieldCondition.Add(new DbQueryFieldSetting()
                {
                    Name = "CreateUserId",
                    Value = scinfo.UserId,
                    DataType = DbQueryFieldDataType.String,
                    QueryType = DbQueryType.Equal
                });
                List<DbQueryFieldGroupSetting> listWhere = new List<DbQueryFieldGroupSetting>();
                listWhere.Add(where);
                qs.WhereCondition = listWhere;
                var result = this.GetDAL<IModelClassDAL>(sc).LoadDatas(qs, sc);
                int? count = result?.Count;
                return (count != null && count > 0);
            };
            return this.CallFuncForContextInfo<bool>(func, sc, "IsHasName", "判断是否重名");
        }
        /// <summary>
        /// 判断分类明是否已经存在（按用户过滤，排除自己）
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        private bool IsHasNameExcludeOneself(ModelClass entity, IServerContext sc)
        {
            Func<ServerContextInfo, bool> func = (scinfo) =>
        {
            var oldEntity = this.GetDAL<IModelClassDAL>(sc).LoadData(entity.Id, sc);
            DbQuerySetting qs = new DbQuerySetting();
            //where条件
            DbQueryFieldGroupSetting where = new DbQueryFieldGroupSetting();
            where.FieldCondition = new List<DbQueryFieldSetting>();
            where.FieldCondition.Add(new DbQueryFieldSetting()
            {
                Name = "Name",
                Value = entity.Name,
                DataType = DbQueryFieldDataType.String,
                QueryType = DbQueryType.Equal
            });
            //过滤当前
            where.FieldCondition.Add(new DbQueryFieldSetting()
            {
                Name = "Id",
                DataType = DbQueryFieldDataType.String,
                Value = entity.Id,
                QueryType = DbQueryType.NotEqual
            });

            List<DbQueryFieldGroupSetting> listWhere = new List<DbQueryFieldGroupSetting>();
            listWhere.Add(where);
            qs.WhereCondition = listWhere;
            var result = this.GetDAL<IModelClassDAL>(sc).LoadDatas(qs, sc);
            int? count = result?.Count;
            return (count != null && count > 0);
        };
            return this.CallFuncForContextInfo<bool>(func, sc, "IsHasNameExcludeOneself", "判断是否重名");
        }
        #endregion
    }
}
