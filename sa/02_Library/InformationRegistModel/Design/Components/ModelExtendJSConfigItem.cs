using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/22 15:28:08
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 信息登记模型】扩展JS配置项
    /// </summary>
    public class ModelExtendJSConfigItem
    {
        /// <summary>
        /// 列表页面扩展JS文件数组
        /// </summary>
        public List<String> List { set; get; }

        /// <summary>
        ///  新增页页扩展JS文件数组
        /// </summary>
        public List<String> Add { set; get; }

        /// <summary>
        /// 详情页扩展JS文件数组
        /// </summary>
        public List<String> Detail { set; get; }


        public ModelExtendJSConfigItem()
        {
            this.List = new List<string>();
            this.Add = new List<string>();
            this.Detail = new List<string>();
        }
    }
}
