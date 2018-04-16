using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/5 10:38:22
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 工具条扩展配置
    /// </summary>
    public class ModelToolBarConfig
    {

        /// <summary>
        /// 新增页扩展工具条
        /// </summary>
        public List<ModelToolBarItemConfig> Add { set; get; }
        /// <summary>
        /// 详情页扩展工具条
        /// </summary>
        public List<ModelToolBarItemConfig> Detail { set; get; }
        /// <summary>
        /// 列表页扩展工具条
        /// </summary>
        public List<ModelToolBarItemConfig> List { set; get; }


        public ModelToolBarConfig()
        {
            this.Add = new List<ModelToolBarItemConfig>();
            this.List = new List<ModelToolBarItemConfig>();
            this.Detail = new List<ModelToolBarItemConfig>();
        }
    }
}
