using LeadingCloud.Framework.Web;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Design;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.InformationRegistModel.Runtime;
using LeadingCloud.MISPT.DataModel.Common;
using LeadingCloud.MISPT.Framework.Common.Components;
using LeadingCloud.MISPT.Framework.Common.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LeadingCloud.MISPT.InformationRegistModel.WebAPI.Controllers
{
    public class RuntimeController : ApiController
    {
        #region 模块信息

        /// <summary>
        /// 获取模块信息
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="tokenId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Runtime/ModelInfo/{appCode}/{businessModuleId}/{sceneCode}/{sceneOrgId}/{tokenId}")]
        public ResponseBag<string> GetModelInfo(string appCode, string businessModuleId, string sceneCode, string sceneOrgId, string tokenId)
        {

            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.GetModuleInfo(appCode, businessModuleId, sceneCode, sceneOrgId, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328100", null);
        }
        /// <summary>
        /// 获取模块信息（不包含用户扩展字段）
        /// </summary>
        /// <param name="businessModuleId"></param>
        /// <param name="tokenId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Runtime/ModelInfo/NoUserField/{appCode}/{businessModuleId}/{sceneCode}/{tokenId}")]
        public ResponseBag<string> GetModelInfoNoUserExtend(string appCode, string businessModuleId, string sceneCode, string tokenId)
        {

            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.GetModuleInfo(appCode, businessModuleId, sceneCode, "", bag.RequestContext, false);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328100", null);
        }

        /// <summary>
        /// 验证模块ID集合，返回经过验证的ID集合
        /// </summary>
        /// <param name="modelIds">模块ID集合，数组形式的json</param>
        /// <param name="tokenId"></param>
        /// <example>
        /// POST数据示例：{modelIds:[id1,id2,id...]}
        /// </example>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/ModelInfo/VerifyModelIds/{tokenId}")]
        public ResponseBag<List<string>> VerifyModelIds([FromBody]string modelIdsJSON, string tokenId)
        {
            Func<StringBag, List<string>> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.VerifyModelIds(modelIdsJSON, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<List<string>>(func, tokenId, "328101", null);
        }
        /// <summary>
        /// 验证模块ID集合，返回经过验证的模块信息集合
        /// </summary>
        /// <param name="modelIds">模块ID集合，数组形式的json</param>
        /// <param name="tokenId"></param>
        /// <example>
        /// POST数据示例：{modelIds:[id1,id2,id...]}
        /// </example>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/ModelInfo/VerifyModelIds/ModelInfo/{tokenId}")]
        public ResponseBag<List<ModelPublishData>> VerifyModelIdsForModelInfo([FromBody]string modelIdsJSON, string tokenId)
        {
            Func<StringBag, List<ModelPublishData>> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.VerifyModelIdsForModelInfo(modelIdsJSON, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<List<ModelPublishData>>(func, tokenId, "328101", null);
        }

        #endregion

        #region 业务数据

        #region 增 删 改

        /// <summary>
        /// 新增某个模块下的业务数据
        /// </summary>
        /// <param name="entity">实体数据</param>
        /// <param name="businessModelId">业务模块ID</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/Add/{businessModelId}/{sceneCode}/{sceneOrgId}/{tokenId}")]
        public ResponseBag<string> Add([FromBody]string entity, string businessModelId, string sceneCode, string sceneOrgId, string tokenId)
        {
            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.AddInformation(businessModelId, sceneCode, sceneOrgId, entity, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328200", null);
        }

        /// <summary>
        /// 修改某个模块下的业务数据（此只能修改表单上的值，内置字段以及未配置的字段无法修改）
        /// </summary>
        /// <param name="entity">实体数据</param>
        /// <param name="businessModelId">业务模块ID</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/Update/{businessModelId}/{sceneCode}/{tokenId}")]
        public ResponseBag<string> Update([FromBody]string entity, string businessModelId, string sceneCode, string tokenId)
        {
            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.UpdateInformation(businessModelId, sceneCode, entity, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328300", null);
        }

        /// <summary>
        /// 修改单个字段
        /// </summary>
        /// <param name="modifiedJson"></param>
        /// <param name="businessModelId"></param>
        /// <param name="sceneCode"></param>
        /// <param name="taskId"></param>
        /// <param name="tokenId"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/SingleModified/{businessModelId}/{sceneCode}/{taskId}/{tokenId}")]
        public ResponseBag<string> SingleModified([FromBody]string modifiedJson, string businessModelId, string sceneCode, string taskId, string tokenId)
        {
            Func<StringBag, string> func = (StringBag bag) =>
           {
               return ModelRuntimeManager.Instance.SingleModified(businessModelId, sceneCode, taskId, modifiedJson, bag.RequestContext);
           };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328304", null);
        }

        /// <summary>
        /// 删除某个模块下的业务数据
        /// </summary>
        /// <param name="businessModelId">业务模块ID</param>
        /// <param name="sceneCode"></param>
        /// <param name="id">业务数据ID</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Runtime/Business/Delete/{businessModelId}/{sceneCode}/{id}/{tokenId}")]
        public ResponseBag<bool> Delete(string businessModelId, string sceneCode, string id, string tokenId)
        {
            Func<StringBag, bool> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.DeleteInformation(businessModelId, sceneCode, id, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<bool>(func, tokenId, "328400", false);
        }
      
        #endregion
       
        #region 查询

        /// <summary>
        /// 查询某个模块下的一条业务数据
        /// </summary>
        /// <param name="businessModelId">业务模块ID</param>
        /// <param name="sceneCode">场景编码</param>
        /// <param name="id">业务数据ID</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Runtime/Business/Load/{businessModelId}/{sceneCode}/{id}/{tokenId}")]
        public ResponseBag<string> Load(string businessModelId, string sceneCode, string id, string tokenId)
        {
            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.LoadInformation(businessModelId, id, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328500", null);
        }

        /// <summary>
        /// 查询某个模块下的一些业务数据
        /// </summary>
        /// <param name="filterEntity">查询实体</param>
        /// <param name="isbyuser">是否根据用户过滤 0标识是，1表示否</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/GetList/{isbyuser}/{tokenId}")]
        public ResponseBag<string> GetListonUser([FromBody]SearchModel filterEntity, int isbyuser, string tokenId)
        {
            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.Getlist(filterEntity, isbyuser, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328501", null);
        }
        /// <summary>
        /// 查询某个模块下的一些业务数据
        /// </summary>
        /// <param name="filterEntity">查询实体</param>
        /// <param name="tokenId">令牌</param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Runtime/Business/GetList/{tokenId}")]
        public ResponseBag<string> GetList([FromBody]SearchModel filterEntity, string tokenId)
        {
            Func<StringBag, string> func = (StringBag bag) =>
            {
                return ModelRuntimeManager.Instance.Getlist(filterEntity,0, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<string>(func, tokenId, "328501", null);
        }

        #endregion



        #endregion
    }
}
