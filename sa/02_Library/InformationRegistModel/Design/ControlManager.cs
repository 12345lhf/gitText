using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.Framework.ModuleBase;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces;
using System.Runtime.CompilerServices;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/4/7 10:41:30
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design
{
    /// <summary>
    /// 控件管理类
    /// </summary>
    public class ControlManager : ModuleManager
    {

        #region 属性

        /// <summary>
        /// Manager实例
        /// </summary>
        public static ControlManager Instance { private set; get; }

        /// <summary>
        /// 应用编码
        /// </summary>
        public override string AppCode { get { return Const.AppCode; } }
        /// <summary>
        /// 静态构造方法
        /// </summary>
        [MethodImpl(MethodImplOptions.Synchronized)]
        static ControlManager()
        {
            //      静态实例，只初始化一次
            if (Instance == null) Instance = new ControlManager();
        }

        #endregion

        #region 对外接口

        /// <summary>
        /// 保存控件信息
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="sc"></param>
        /// <returns></returns>
        public ControlEntity Save(ControlEntity entity, IServerContext sc)
        {
            Func<ControlEntity> func = () =>
            {
                //          1.1 数据验证
                if (entity == null) ThrowErrorCodeException("数据对象为空");
                if (String.IsNullOrEmpty(entity.Code)) ThrowArgException("控件编码不能为空");
                if (String.IsNullOrEmpty(entity.Name)) ThrowArgException("控件名称不能为空");
                if (String.IsNullOrEmpty(entity.Id)) entity.Id = Guid.NewGuid().ToString();
                ServerContextInfo scInfo = GetServerContextInfo(sc);
                //          1.2 默认值处理
                #region 代码折叠：       默认值处理
                String id = entity.Id;
                IControlDAL dal = this.GetDAL<IControlDAL>(sc);
                ControlEntity oldData = dal.LoadData(id, sc);

                if (oldData == null)
                {
                    //              新增数据
                    entity.AddTime = DateTime.Now;
                    entity.AddUserId = scInfo.UserId;
                    entity.OrganizationId = scInfo.OrgId;
                }
                #endregion
                //          1.3 保存数据
                entity = dal.SaveData(entity, sc);
                return entity;
            };
            return this.CallFunc<ControlEntity>(func, sc, "Save", "保存控件数据");
        }

        /// <summary>
        /// 删除控件信息
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>成功返回true；否则返回false</returns>
        public bool Delete(String id, IServerContext sc)
        {
            Func<bool> func = () =>
            {
                //          只能删除未发布过的
                IControlDAL dal = GetDAL<IControlDAL>(sc);
                ControlEntity data = dal.LoadData(id, sc);
                if (data == null) ThrowErrorCodeException("不存在此控件");
                //          删除
                return dal.DeleteData(id, sc);
            };
            return this.CallFunc<bool>(func, sc, "Delete", "删除控件信息");
        }

        /// <summary>
        /// 根据编码批量获取控件列表
        /// </summary>
        /// <param name="codes">控件编码集合</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合</returns>
        public List<ControlEntity> GetControlsByCode(List<string> codes, IServerContext sc)
        {
            Func<List<ControlEntity>> func = () =>
            {
                return this.GetDAL<IControlDAL>(sc).GetControlsByCode(codes, sc);
            };
            return this.CallFunc<List<ControlEntity>>(func, sc, "GetControlsByCode", " 根据编码批量获取控件列表");
        }
        /// <summary>
        /// 根据编码获取控件列表
        /// </summary>
        /// <param name="code">控件编码</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>返回控件配置或null</returns>
        public ControlEntity GetControlByCode(string code, IServerContext sc)
        {
            Func<ControlEntity> func = () =>
            {
                List<string> codes = new List<string>();
                codes.Add(code);
                var list = this.GetDAL<IControlDAL>(sc).GetControlsByCode(codes, sc);

                return list.Count > 0 ? list[0] : null;
            };
            return this.CallFunc<ControlEntity>(func, sc, "GetControlByCode", " 根据编码获取控件列表");
        }
        /// <summary>
        /// 获取控件列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        public List<ControlEntity> GetControlList(IServerContext sc)
        {
            Func<List<ControlEntity>> func = () => { return this.GetDAL<IControlDAL>(sc).GetControlList(sc); };
            return this.CallFunc<List<ControlEntity>>(func, sc, "GetControlList", "获取控件列表");
        }

        /// <summary>
        /// 获取用户控件列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回用户+默认控件集合，否则返回null</returns>
        public List<ControlEntity> GetUserControlList(IServerContext sc)
        {
            Func<ServerContextInfo, List<ControlEntity>> func = (scinfo) =>
            {
                return this.GetDAL<IControlDAL>(sc).GetUserControlList(scinfo.UserId,sc);
            };
            return this.CallFuncForContextInfo<List<ControlEntity>>(func, sc, "GetControlList", "获取用户控件列表");
        }


        /// <summary>
        /// 获取控件
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        public ControlEntity GetControl(String id, IServerContext sc)
        {
            Func<ControlEntity> func = () => { return this.LoadData<IControlDAL, ControlEntity>(id, sc); };
            return this.CallFunc<ControlEntity>(func, sc, "GetControl", "获取控件");
        }

        #endregion



    }
}
