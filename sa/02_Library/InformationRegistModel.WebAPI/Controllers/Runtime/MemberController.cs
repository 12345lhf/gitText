using LeadingCloud.Framework.Web;
using LeadingCloud.MISPT.InformationRegistModel.Runtime;
using LeadingCloud.MISPT.Framework.Common.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LeadingCloud.MISPT.InformationRegistModel.WebAPI.Controllers.Runtime
{
    public class MemberController : ApiController
    {

        /// <summary>
        /// 批量添加成员
        /// </summary>
        /// <param name="entity">数组形式的JSON字符串
        /// 例：
        /// "Members":{[
        ///    {
        ///        //用户ID
        ///        "UserId": "",
        ///        //用户头像ID
        ///        "UserFaceId": "",
        ///        //用户组织机构ID
        ///        "OrganizationId": "",
        ///    }
        /// ]}
        /// </param>
        /// <param name="businessModelId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/Member/Add/{businessModelId}/{sceneCode}/{taskId}/{tokenId}")]
        public ResponseBag<bool> AddMember([FromBody]string members, string businessModelId, string sceneCode,string taskId,string tokenId)
        {
            Func<StringBag, bool> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.AddMembers(businessModelId, sceneCode, taskId,members, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<bool>(func, tokenId, "328900", false);
        }

        /// <summary>
        /// 删除成员
        /// </summary>
        /// <param name="entity">数组形式的JSON字符串
        /// 例：
        /// "Members":{[
        ///    {
        ///        //用户ID
        ///        "UserId": "",
        ///        //用户组织机构ID
        ///        "OrganizationId": "",
        ///    }
        /// ]}
        /// </param>
        /// 
        /// <param name="businessModelId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/Member/Remove/{businessModelId}/{sceneCode}/{taskId}/{tokenId}")]
        public ResponseBag<bool> RemoveMember([FromBody]string members, string businessModelId, string sceneCode, string taskId, string tokenId)
        {
            Func<StringBag, bool> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.RemoveMembers(businessModelId, sceneCode,taskId, members, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<bool>(func, tokenId, "328901", false);
        }



    }
}
