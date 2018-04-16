using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.Framework.NoSql;
using Newtonsoft.Json;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.Framework.DB.ModelAttribute;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;


/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/23 17:23:30
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】设计时配置
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{

    /// <summary>
    /// 【信息登记模型】模块设计时配置数据
    /// </summary>
    [LZDbTable(AppCode = Const.AppCode, TableName = "IRM_ModelDesignData")]
    public class ModelDesignData : ModelConfigBase
    {
        /// <summary>
        /// 模块当前的状态
        /// </summary>
        public Enumerations.ModelState State { set; get; }

        /// <summary>
        /// 模块的创建时间
        /// </summary>
        public DateTime? AddTime { set; get; }

        /// <summary>
        /// 模块创建者用户id
        /// </summary>
        public String AddUserId { set; get; }

        /// <summary>
        /// 模块发布日期
        /// </summary>
        public DateTime? PublishTime { set; get; }

        /// <summary>
        /// 模块发布操作者
        /// </summary>
        public String PublishUserId { set; get; }

        /// <summary>
        /// 模块分类Id
        /// </summary>
        public String ClassId { set; get; }
    }

    /// <summary>
    /// 【信息登记模型】模块发布后的配置数据
    /// </summary>
    [LZDbTable(AppCode = Const.AppCode, TableName = "IRM_ModelPublishData")]
    public class ModelPublishData : ModelConfigBase
    {

        /// <summary>
        /// 根据设置时数据创建新实例
        /// </summary>
        /// <param name="designData">设计时数据</param>
        /// <returns></returns>
        public static ModelPublishData New(ModelDesignData designData)
        {
            if (designData == null) return null;
            return new ModelPublishData()
            {
                Id = designData.Id,
                Name = designData.Name,
                Description = designData.Description,
                Propertys = designData.Propertys,
                FormConfig = designData.FormConfig,
                ExtendConfig = designData.ExtendConfig,
                ListConfig=designData.ListConfig,
            };
        }

    }
}
