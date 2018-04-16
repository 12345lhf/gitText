using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Common;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Enumerations;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;
using LeadingCloud.Framework;
using System.Runtime.CompilerServices;
using LeadingCloud.Framework.Manager;
using LeadingCloud.MISPT.Framework.ModuleBase;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.DataModel.Database;
using LeadingCloud.MISPT.DataModel.Database.Enumerations;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 10:02:26
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】模块设计时管理类
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design
{
    /// <summary>
    /// 【信息登记模型】模块配置管理类
    /// </summary>
    public class ModelDesignManager : ModuleManager
    {
        /// <summary>
        /// Manager实例
        /// </summary>
        public static ModelDesignManager Instance { private set; get; }

        /// <summary>
        /// 应用编码
        /// </summary>
        public override string AppCode { get { return Const.AppCode; } }

        #region 给模块设计时使用的接口

        #region 数据查询
        /// <summary>
        /// 【设计时】获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        public List<ModelDesignData> GetDesignDataList(IServerContext sc)
        {
            Func<List<ModelDesignData>> func = () => { return this.GetDAL<IModelDesignDataDAL>(sc).GetDesignDataList(sc); };
            return this.CallFunc<List<ModelDesignData>>(func, sc, "GetDesignDataList", "【设计时】获取模块列表");
        }

        /// <summary>
        /// 【设计时】更具创建用户获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        public List<ModelDesignData> GetDesignDataListByUser(IServerContext sc)
        {
            Func<List<ModelDesignData>> func = () =>
            {
                return this.GetDAL<IModelDesignDataDAL>(sc).GetDesignDataList(sc).Where(x => x.AddUserId == sc.GetService<String>("uid")).ToList();
            };
            return this.CallFunc<List<ModelDesignData>>(func, sc, "GetDesignDataList", "【设计时】获取模块列表");
        }

        /// <summary>
        /// 【设计时】更具创建用户获取模块列表，并按分类过滤
        /// </summary>
        /// <param name="classId">分类ID</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        public List<ModelDesignData> GetDesignDataListByUserAndClass(string classId, IServerContext sc)
        {
            Func<ServerContextInfo, List<ModelDesignData>> func = (scinfo) =>
            {

                DbQuerySetting qs = new DbQuerySetting();
                //where条件
                DbQueryFieldGroupSetting where = new DbQueryFieldGroupSetting();
                where.FieldCondition = new List<DbQueryFieldSetting>();
                //根据用户过滤
                where.FieldCondition.Add(new DbQueryFieldSetting()
                {
                    Name = "AddUserId",
                    Value = scinfo.UserId,
                    DataType = DbQueryFieldDataType.String,
                    QueryType = DbQueryType.Equal
                });
                //根据分类过滤
                where.FieldCondition.Add(new DbQueryFieldSetting()
                {
                    Name = "ClassId",
                    Value = classId,
                    DataType = DbQueryFieldDataType.String,
                    QueryType = DbQueryType.Equal
                });
                List<DbQueryFieldGroupSetting> listWhere = new List<DbQueryFieldGroupSetting>();
                listWhere.Add(where);

                List<DbQueryOrderSetting> listOrder = new List<DbQueryOrderSetting>();
                //按创建时间倒序排序
                listOrder.Add(new DbQueryOrderSetting()
                {
                    Name = "AddTime",
                    IsASC = false
                });

                qs.WhereCondition = listWhere;
                qs.OrderSetting = listOrder;

                return this.GetDAL<IModelDesignDataDAL>(sc).LoadDatas(qs, sc);
            };
            return this.CallFuncForContextInfo<List<ModelDesignData>>(func, sc, "GetDesignDataList", "【设计时】获取模块列表");
        }


        /// <summary>
        /// 【设计时】更具创建用户获取模块列表，并按分类过滤
        /// </summary>
        /// <param name="classId">分类ID</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        public List<ModelDesignData> GetDesignDataListByQuery(DbQuerySetting query, IServerContext sc)
        {
            Func<ServerContextInfo, List<ModelDesignData>> func = (scinfo) =>
            {
                return this.GetDAL<IModelDesignDataDAL>(sc).LoadDatas(query, sc);
            };
            return this.CallFuncForContextInfo<List<ModelDesignData>>(func, sc, "GetDesignDataListByQuery", "【设计时】获取模块列表");
        }



        /// <summary>
        /// 【设计时】获取模块配置
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        public ModelDesignData GetDesignData(String id, IServerContext sc)
        {
            Func<ModelDesignData> func = () => { return this.LoadData<IModelDesignDataDAL, ModelDesignData>(id, sc); };
            return this.CallFunc<ModelDesignData>(func, sc, "GetDesignData", "【设计时】获取模块配置");
        }
        #endregion

        #region 数据编辑
        /// <summary>
        /// 【设计时】保存设计时数据
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="fromPublishModel">调用此接口的来源动作：是否来自发布模块</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        public ModelDesignData SaveDesignData(ModelDesignData data, Boolean fromPublishModel, IServerContext sc)
        {
            Func<ModelDesignData> func = () =>
            {
                //          1.1 数据验证
                if (data == null) ThrowErrorCodeException("数据对象为空");
                if (String.IsNullOrEmpty(data.Name)) ThrowArgException("请输入模块名称");
                if (String.IsNullOrEmpty(data.Id)) data.Id = Guid.NewGuid().ToString();
                ServerContextInfo scInfo = GetServerContextInfo(sc);
                //          1.2 默认值处理
                #region 代码折叠：       默认值处理
                String id = data.Id;
                IModelDesignDataDAL dal = this.GetDAL<IModelDesignDataDAL>(sc);
                ModelDesignData oldData = dal.LoadData(id, sc);
                if (oldData == null)
                {
                    //              新增数据
                    data.AddTime = DateTime.Now;
                    data.AddUserId = scInfo.UserId;
                }
                //                  模块状态处理：是【发布模块】调用此接口时始终为【已发布】；否则新增时为【始终未发布】，保存时为【已保存未发布】
                if (fromPublishModel == true)
                {
                    data.State = ModelState.Published;
                    data.PublishTime = DateTime.Now;
                    data.PublishUserId = scInfo.UserId;
                }
                else
                {
                    if (oldData == null || oldData.State == ModelState.Never) data.State = ModelState.Never;
                    else data.State = ModelState.Saved;
                }
                #endregion
                //          1.3 保存数据
                data = dal.SaveData(data, sc);
                //          1.4 记录保存日志
                this.WriteLog("保存模块数据", oldData, data, sc);
                //          1.5 返回数据
                return data;
            };
            return this.CallFunc<ModelDesignData>(func, sc, "SaveDesignData", "【设计时】保存设计时数据");
        }

        /// <summary>
        /// 【设计时】变更设计时模块分类
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="fromPublishModel">调用此接口的来源动作：是否来自发布模块</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        public ModelDesignData ResetModelClass(string id, string newClassId, IServerContext sc)
        {
            Func<ModelDesignData> func = () =>
            {
                ModelDesignData serverData = this.GetDesignData(id, sc);
                if (serverData == null)
                {
                    ThrowErrorCodeException("模块不存在");
                }
                serverData.ClassId = newClassId;
                serverData = this.SaveDesignData(serverData, false, sc);
                return serverData;
            };
            return this.CallFunc<ModelDesignData>(func, sc, "ResetModelClass", "【设计时】变更设计时模块分类");
        }

        /// <summary>
        /// 【设计时】发布模块
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        public ModelDesignData PublishModel(ModelDesignData data, IServerContext sc)
        {
            Func<ModelDesignData> func = () =>
            {
                //          1.1 保存模块数据
                data = this.SaveDesignData(data, true, sc);
                //          1.2 组装模块发布数据
                ModelPublishData publishData = ModelPublishData.New(data);
                //          1.3 获取当前id指定的数据
                String id = publishData.Id;
                IModelPublishData dal = this.GetDAL<IModelPublishData>(sc);
                ModelPublishData oldPublishData = dal.LoadData(id, sc);
                //          1.4 保存数据
                publishData = dal.SaveData(publishData, sc);
                //          1.5 记录日志
                this.WriteLog("发布模块", oldPublishData, publishData, sc);
                //          1.6 返回数据
                return data;
            };
            return this.CallFunc<ModelDesignData>(func, sc, "PublishModel", "【设计时】发布模块");
        }

        /// <summary>
        /// 【设计时】删除设计时数据
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>成功返回true；否则返回false</returns>
        public Boolean DeleteDesignData(String id, IServerContext sc)
        {
            Func<Boolean> func = () =>
            {
                //          只能删除未发布过的
                IModelDesignDataDAL dal = GetDAL<IModelDesignDataDAL>(sc);
                ModelDesignData data = dal.LoadData(id, sc);
                if (data == null) ThrowErrorCodeException("不存在此模块");
                if (data.State != ModelState.Never) ThrowErrorCodeException("只能删除从未发布过的模块");
                //          删除
                return dal.DeleteData(id, sc);
            };
            return this.CallFunc<Boolean>(func, sc, "DeleteDesignData", "【设计时】删除设计时数据");
        }
        #endregion

        #endregion

        #region 给模块运行时使用的接口
        /// <summary>
        /// 【运行时】获取模块发布后的数据
        /// </summary>
        /// <param name="id">模块主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回模块对象；否则返回null</returns>
        public ModelPublishData GetPublishModel(String id, IServerContext sc)
        {
            Func<ModelPublishData> func = () =>
            {
                return this.LoadData<IModelPublishData, ModelPublishData>(id, sc);
            };
            return this.CallFunc<ModelPublishData>(func, sc, "GetPublishModel", "【运行时】获取模块发布后的数据 ");
        }

        /// <summary>
        /// 【运行时】批量获取模块发布后的数据
        /// </summary>
        /// <param name="ids">模块主键id集合</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回模块对象集合；否则返回null</returns>
        public List<ModelPublishData> GetPublishModels(List<String> ids, IServerContext sc)
        {
            Func<List<ModelPublishData>> func = () => { return this.LoadDatas<IModelPublishData, ModelPublishData>(ids, sc); };
            return this.CallFunc<List<ModelPublishData>>(func, sc, "GetPublishModels", "【运行时】批量获取模块发布后的数据");
        }

        #endregion

        #region 模块操作日志
        /// <summary>
        /// 记录操作日志
        /// </summary>
        /// <param name="logTitle">日志标题</param>
        /// <param name="oldData">旧数据</param>
        /// <param name="newData">新数据</param>
        /// <param name="sc">上下文</param>
        private void WriteLog(String logTitle, ModelConfigBase oldData, ModelConfigBase newData, IServerContext sc)
        {
            ServerContextInfo scInfo = this.GetServerContextInfo(sc);
            ModelConfigLog log = new ModelConfigLog()
            {
                Id = Guid.NewGuid().ToString(),
                LogDate = DateTime.Now,
                LogTitle = logTitle,
                LogUserId = scInfo.UserId,
                OldConfig = oldData,
                NewConfig = newData,
            };
            this.SaveData<IModelConfigLogDAL, ModelConfigLog>(log, sc);
        }
        #endregion

        #region 其他
        /// <summary>
        /// 构造方法
        /// </summary>
        private ModelDesignManager()
        {
        }

        /// <summary>
        /// 静态构造方法
        /// </summary>
        [MethodImpl(MethodImplOptions.Synchronized)]
        static ModelDesignManager()
        {
            //      静态实例，只初始化一次
            if (Instance == null) Instance = new ModelDesignManager();
        }
        #endregion

    }
}
