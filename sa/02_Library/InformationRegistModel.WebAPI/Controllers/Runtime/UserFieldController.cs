using LeadingCloud.Framework.Web;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Design;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Runtime;
using LeadingCloud.MISPT.InformationRegistModel.Runtime.Components;
using LeadingCloud.MISPT.DataModel.Common;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.Framework.Common.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LeadingCloud.MISPT.InformationRegistModel.WebAPI.Controllers.Runtime
{
    public class UserFieldController : ApiController
    {
        /// <summary>
        /// 【运行时】保存模块
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/Runtime/UserField/SaveModel/{tokenid}")]
        [HttpPost]
        public ResponseBag<ModelUserExtendConfig> SaveModel([FromBody]ModelUserExtendConfig model, String tokenId)
        {
            Func<StringBag, ModelUserExtendConfig> func = (StringBag bag) =>
            {
                return ModelUserDefinedFieldManager.Instance.SaveUserExtendData(model, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelUserExtendConfig>(func, tokenId, "328700", null);
        }
        /// <summary>
        /// 【运行时】获取用户扩展配置信息
        /// </summary>
        /// <param name="businessModuleId">业务模块id</param>
        /// <param name="sceneCode">场景id</param>
        /// <param name="tokenId"></param>
        /// <returns></returns>
        [Route("api/Runtime/UserField/GatData/{businessModuleId}/{sceneCode}/{sceneOrgId}/{tokenid}")]
        [HttpGet]
        public ResponseBag<ModelUserExtendConfig> GetData(string businessModuleId, string sceneCode, string sceneOrgId, String tokenId)
        {
            Func<StringBag, ModelUserExtendConfig> func = (StringBag bag) =>
            {
                return ModelUserDefinedFieldManager.Instance.GetData(businessModuleId, sceneCode, sceneOrgId, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelUserExtendConfig>(func, tokenId, "328701", null);
        }

        /// <summary>
        /// 只获用户扩展的取配置的信息
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="tokenId"></param>
        /// <returns></returns>
        [Route("api/Runtime/UserField/GetModulUserFields/{businessModuleId}/{sceneCode}/{sceneOrgId}/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ModelUserExtendFieldConfig>> GetModulUserFields(string businessModuleId, string sceneCode, string sceneOrgId, String tokenId)
        {
            Func<StringBag, List<ModelUserExtendFieldConfig>> func = (StringBag bag) =>
            {
                return ModelUserDefinedFieldManager.Instance.GetModulUserFields(businessModuleId, sceneCode, sceneOrgId, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<List<ModelUserExtendFieldConfig>>(func, tokenId, "328704", null);
        }

    }
}
