using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


/*********************************************************
 * 创建者：lz-XXX
 * 创建日期：2017/3/9 17:32:48
 * 机器名称：WJS
 * 描述：
 * *******************************************************/
namespace LeadingCloud.MISPT.InformationRegistModel.Runtime.Enumerations
{
    /// <summary>
    /// 列表类型（头部筛选）
    /// </summary>
    public enum ListType
    {

        #region 列表类型 筛选说明
        /*
           服务端任务状态：state  //和平台的任务状态相同 参考：enum Enum_TaskStatus
               1：未发布的
               2：已发布的/进行中
               3：已完成的
               4：废弃的
               5：暂停的
           客户端提交筛选类型： SearchModel.ListType
               0：未发布的
               1：我负责的
               2：我参与的
               3：星标的
               4：废弃的
               5：完成的 
          未发布的任务：显示我创建未发布的任务
                        1、state = 1
          我负责的任务：显示我负责的已发布的任务
                        1、根据成员表（mp_member）获取任务IDS,条件AppCode、SceneCode、BusinessModuleCode、UserId、UserType = 1,
                        2、根据 ids和state = 2 获取
          我参与的任务：显示我创建的未发布、已发布的任务和我参与的已发布的任务
                        获取和我相关的任务（创建的未发布、已发布的任务）
                        1、根据成员表（mp_member）获取任务IDS,条件AppCode、SceneCode、BusinessModuleCode、UserId、UserType = 1或者UserType = 2
                        *****说明：此次筛选需要过滤掉没有接收邀请的人员*****
                        2、根据 ids和 state = 1或者state = 2 获取
          星标的任务  ：显示我收藏的所有任务
                        1、根据成员表（mp_favourite）获取任务IDS,条件AppCode、SceneCode、BusinessModuleCode、UserId,
                        2、根据 ids 获取
          废弃的任务  ：显示我参与的和我负责的已废弃的任务
                        1、根据成员表（mp_member）获取任务IDS,条件AppCode、SceneCode、BusinessModuleCode、UserId、UserType = 1或者UserType = 2,
                        2、根据 ids和state = 4 获取
          完成的任务  ：显示我参与的和我负责的已完成的任务
                        1、根据成员表（mp_member）获取任务IDS,条件AppCode、SceneCode、BusinessModuleCode、UserId、UserType = 1或者UserType = 2,
                        2、根据 ids和state = 3 获取
          我托付的任务：显示我托付给别人的任务
         * 
         ************************** 最后的筛选结果勿忘添加该条记录是否收藏********************
         */
        #endregion
        /// <summary>
        /// 未发布的
        /// </summary>
        UnPulish = 0,
        /// <summary>
        /// 我负责的
        /// </summary>
        MyCharge = 1,
        /// <summary>
        /// 我参与的
        /// </summary>
        MyJoin = 2,
        /// <summary>
        /// 星标的
        /// </summary>
        MyFavorite = 3,
        /// <summary>
        /// 废弃的
        /// </summary>
        Discard = 4,
        /// <summary>
        /// 完成的
        /// </summary>
        Finish = 5
    }
}
