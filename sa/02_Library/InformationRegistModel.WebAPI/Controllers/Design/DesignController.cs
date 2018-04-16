using LeadingCloud.Framework.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LeadingCloud.MISPT.InformationRegistModel.Design;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using LeadingCloud.MISPT.Framework.Common.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.DataModel.Database;

namespace LeadingCloud.MISPT.InformationRegistModel.WebAPI.Controllers
{
    /// <summary>
    /// 信息登记模型设计时WebAPI控制器
    /// </summary>
    public class DesignController : ApiController
    {
        /// <summary>
        /// 获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/GetModelList/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ModelDesignData>> GetModelList(String tokenId)
        {
            Func<StringBag, List<ModelDesignData>> func = (StringBag bag) =>
             {
                 return ModelDesignManager.Instance.GetDesignDataList(bag.RequestContext);
             };
            return ApiControllerHelper.CallFunc<List<ModelDesignData>>(func, tokenId, "328001", null);
        }

        /// <summary>
        /// 【设计时】根据创建用户获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/GetDesignDataListByUser/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ModelDesignData>> GetDesignDataListByUser(String tokenId)
        {
            Func<StringBag, List<ModelDesignData>> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.GetDesignDataListByUser(bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<List<ModelDesignData>>(func, tokenId, "328006", null);
        }


        /// <summary>
        /// 【设计时】根据创建用户获取模块列表，并过滤分类
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/GetDesignDataListByUserAndClass/{classId}/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ModelDesignData>> GetDesignDataListByUserAndClass(string classId, String tokenId)
        {
            Func<StringBag, List<ModelDesignData>> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.GetDesignDataListByUserAndClass(classId, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<List<ModelDesignData>>(func, tokenId, "328006", null);
        }

        /// <summary>
        /// 【设计时】根据查询实体获取模块列表
        /// </summary>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回集合，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/GetDesignDataListByQuery/{classId}/{tokenid}")]
        [HttpPost]
        public ResponseBag<List<ModelDesignData>> GetDesignDataListByQuery(DbQuerySetting query, String tokenId)
        {
            Func<StringBag, List<ModelDesignData>> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.GetDesignDataListByQuery(query, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<List<ModelDesignData>>(func, tokenId, "328006", null);
        }


        /// <summary>
        /// 【设计时】获取模块
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/GetModel/{id}/{tokenid}")]
        [HttpGet]
        public ResponseBag<ModelDesignData> GetModel(String id, String tokenId)
        {
            Func<StringBag, ModelDesignData> func = (StringBag bag) =>
               {
                   return ModelDesignManager.Instance.GetDesignData(id, bag.RequestContext);
               };
            return ApiControllerHelper.CallFunc<ModelDesignData>(func, tokenId, "328002", null);
        }

        /// <summary>
        /// 【设计时】保存模块
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/SaveModel/{tokenid}")]
        [HttpPost]
        public ResponseBag<ModelDesignData> SaveModel([FromBody]ModelDesignData model, String tokenId)
        {
            Func<StringBag, ModelDesignData> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.SaveDesignData(model, false, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelDesignData>(func, tokenId, "328003", null);
        }

        /// <summary>
        /// 【设计时】变更设计时模块分类
        /// </summary>
        /// <param name="id">模块ID</param>
        /// <param name="classId">分类ID</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/ResetModelClass/{id}/{classId}/{tokenid}")]
        [HttpGet]
        public ResponseBag<ModelDesignData> ResetModelClass(string id, string classId, String tokenId)
        {
            Func<StringBag, ModelDesignData> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.ResetModelClass(id, classId, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelDesignData>(func, tokenId, "328003", null);
        }

        /// <summary>
        /// 【设计时】发布模块
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/Design/PublishModel/{tokenid}")]
        [HttpPost]
        public ResponseBag<ModelDesignData> PublishModel([FromBody]ModelDesignData model, String tokenId)
        {
            Func<StringBag, ModelDesignData> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.PublishModel(model, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelDesignData>(func, tokenId, "328004", null);
        }

        /// <summary>
        /// 【设计时】删除模块
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="tokenId">令牌</param>
        /// <returns>成功返回true；否则返回false</returns>
        [Route("api/" + Const.AppCode + "/Design/DeleteModel/{id}/{tokenid}")]
        [HttpGet]
        public ResponseBag<Boolean> DeleteModel(String id, String tokenId)
        {
            Func<StringBag, Boolean> func = (StringBag bag) =>
            {
                return ModelDesignManager.Instance.DeleteDesignData(id, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<Boolean>(func, tokenId, "328005", false);
        }
    }
}
