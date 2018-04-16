using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using LeadingCloud.MISPT.Framework.Common.Utils;
using LeadingCloud.Global.Interface;
using System.Xml;
using System.Web;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/23 16:39:16
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】系统初始化的助手类
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Common.Utils
{
    /// <summary>
    /// 【信息登记模型】系统初始化的助手类
    /// </summary>
    public sealed class SystemInitHelper : ILZInitialization
    {
        #region 为实现底层平台的接口做的处理
        /// <summary>
        /// 必须有这个构造
        /// </summary>
        /// <param name="node"></param>
        public SystemInitHelper(XmlNode node)
        {
        }
        /// <summary>
        /// 实现底层平台的处理接口
        /// </summary>
        /// <param name="httpApplication"></param>
        void ILZInitialization.Execute(HttpApplication httpApplication)
        {
            Init();
        }
        #endregion
        /// <summary>
        /// 锁变量
        /// </summary>
        private static Boolean lockVar = false;

        /// <summary>
        /// 私有构造方法
        /// </summary>
        private SystemInitHelper() { }

        /// <summary>
        /// 初始化系统
        /// </summary>
        [MethodImpl(MethodImplOptions.Synchronized)]
        public static void Init()
        {
            //      0.保证始终只执行一次
            if (lockVar == true) return;
            lockVar = true;

            //      1.初始化系统的错误编码
            InitErrorCode();

            //      2.初始化发布订阅消息

        }


        #region 初始化系统错误编码
        /// <summary>
        /// 初始化ErrorCode信息
        /// </summary>
        private static void InitErrorCode()
        {
            //      1.初始化为字典，加入错误信息
            Dictionary<String, String> errorCode = new Dictionary<string, string>();

            //      2.初始化实际的错误编码和错误信息

            #region 错误编码：信息登记模型设计时 328000~328099
            errorCode["328001"] = "获取登记单模块列表数据失败";
            errorCode["328002"] = "获取登记单模块数据失败";
            errorCode["328003"] = "保存登记单模块数据失败";
            errorCode["328004"] = "发布登记单模块数据失败";
            errorCode["328005"] = "删除登记单模块数据失败";

            #endregion

            #region 错误编码：信息登记模型运行时  328100~328999
            errorCode["328100"] = "获取登记单模块配置信息失败";
            errorCode["328101"] = "验证模块ID集合信息失败";
            errorCode["328102"] = "获取事务类型ID失败";
            errorCode["328200"] = "新增登记单模块信息失败";
            errorCode["328201"] = "新增并发布登记单模块信息失败";
            errorCode["328300"] = "修改登记单模块信息失败";
            errorCode["328301"] = "发布登记单模块信息失败";
            errorCode["328302"] = "废弃登记单模块信息失败";
            errorCode["328303"] = "保存并发布登记单模块信息失败";
            errorCode["328304"] = "修改登记单模块属性信息失败";
            errorCode["328305"] = "完成登记单模块信息失败";


            errorCode["328351"] = "添加模块分类失败";
            errorCode["328352"] = "修改模块分类失败";
            errorCode["328353"] = "删除模块分类失败";
            errorCode["328354"] = "查询模块分类失败";


            errorCode["328400"] = "删除登记单模块信息失败";

            errorCode["328500"] = "获取登记单模块信息失败";
            errorCode["328501"] = "根据查询条件获取任务模块信息失败";
            errorCode["328502"] = "获取图表信息失败";
            errorCode["328503"] = "获取变成协商列表数据失败";
            errorCode["328504"] = "获取部门人员管理信息失败";
            errorCode["328505"] = "获取对应字段信息失败";
            errorCode["328506"] = "获取登记单列表数失败";
            errorCode["328507"] = "获取联合列表失败";
            errorCode["328508"] = "按照用户批量获取列表数失败";
            errorCode["328509"] = "根据用户过滤获取模块信息失败";

            errorCode["328700"] = "保存用户扩展配置信息失败";
            errorCode["328701"] = "获取用户扩展配置信息失败";
            errorCode["328702"] = "获取模块失败";
            errorCode["328703"] = "获取模块列表失败";
            errorCode["328704"] = "获取用户扩展的配置的信息失败";

            errorCode["328600"] = "保存控件失败";
            errorCode["328601"] = "删除控件失败";
            errorCode["328602"] = "查询控件失败";
            errorCode["328603"] = "查询控件列表失败";
            errorCode["328800"] = "添加收藏失败";
            errorCode["328801"] = "删除收藏失败";

            errorCode["328900"] = "添加成员失败";
            errorCode["328901"] = "删除成员失败";
            errorCode["328902"] = "修改成员组织机构id失败";
            errorCode["328903"] = "修改成员的成员类型失败";
            #endregion


            //      3.注册给助手类
            ErrorCodeHelper.AddErrorCode(errorCode);
        }
        #endregion
    }
}
