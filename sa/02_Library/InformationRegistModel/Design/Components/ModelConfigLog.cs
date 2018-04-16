using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.Framework.NoSql;
using LeadingCloud.Framework.LZConfiguration;
using LeadingCloud.Framework.DB.ModelAttribute;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.Framework.Database.Components;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 9:59:36
 * 机器名称：FZJ-WIN10
 * 描述：【协作任务模块】配置日志类
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 【协作任务模块】配置日志类
    /// </summary>
    [LZDbTable(AppCode = Const.AppCode, TableName = "IRM_ModelConfigLog")]
    public class ModelConfigLog : DbModel
    {
        /// <summary>
        /// 日志的操作标题
        /// </summary>
        public String LogTitle { set; get; }

        /// <summary>
        /// 什么时候修改了配置
        /// </summary>
        public DateTime LogDate { set; get; }

        /// <summary>
        /// 谁修改了配置
        /// </summary>
        public String LogUserId { set; get; }

        /// <summary>
        /// 修改前的配置数据
        /// </summary>
        public ModelConfigBase OldConfig { set; get; }

        /// <summary>
        /// 修改后的配置数据
        /// </summary>
        public ModelConfigBase NewConfig { set; get; }
    }
}
