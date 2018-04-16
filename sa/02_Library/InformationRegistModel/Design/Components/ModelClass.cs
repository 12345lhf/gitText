using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.Framework.Database.Components;
using LeadingCloud.Framework.DB.ModelAttribute;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/6/13 9:13:04
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Components
{
    /// <summary>
    /// 
    /// </summary>
    [LZDbTable(AppCode = Const.AppCode, TableName = "IRM_ModelClass")]
    public class ModelClass : DbModel
    {

        public ModelClass()
        {
            this.Id = "";
            this.Name = "";
            this.CreateUserId = "";
            this.CreateOrganizationId = "";
        }

        /// <summary>
        /// 分类名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 创建人用户ID
        /// </summary>
        public string CreateUserId { get; set; }
        /// <summary>
        /// 创建人组织机构ID
        /// </summary>
        public string CreateOrganizationId { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
    }
}
