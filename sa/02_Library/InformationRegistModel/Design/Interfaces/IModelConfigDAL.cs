using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Design.Enumerations;
using LeadingCloud.Framework;
using LeadingCloud.MISPT.Framework.Database.Interfaces;

/*********************************************************
 * 创建者：lz-fzj
 * 创建日期：2017/2/24 10:03:15
 * 机器名称：FZJ-WIN10
 * 描述：【信息登记模型】配置数据数据库访问程序接口
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Design.Interfaces
{
    /// <summary>
    /// 【信息登记模型】模块设计时配置数据访问程序接口
    /// </summary>
    public interface IModelDesignDataDAL : IDbModelDAL<ModelDesignData>
    {
        /// <summary>
        /// 【设计时】获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        List<ModelDesignData> GetDesignDataList(IServerContext sc);
    }

    /// <summary>
    /// 【信息登记模型】模块发布后的配置数据访问程序接口
    /// </summary>
    public interface IModelPublishData : IDbModelDAL<ModelPublishData>
    {

    }
}
